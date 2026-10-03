"""
Day 12 - Risk Prediction: Data Preparation

Pulls areas + incidents from MongoDB, engineers per-area features,
and builds a labeled dataset for training a risk classification model.
"""

import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from pathlib import Path


# ---------------------------------------------------------------------------
# Setup: load environment variables and connect to MongoDB
# ---------------------------------------------------------------------------

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

client = MongoClient(os.getenv("MONGODB_URI"))
db = client.get_default_database()


# ---------------------------------------------------------------------------
# Main dataset-building function
# ---------------------------------------------------------------------------

def build_dataset():
    # Step 1: Load raw collections
    areas = list(db.areas.find())
    incidents = list(db.incidents.find())

    print(f"Loaded {len(areas)} areas and {len(incidents)} incidents")

    incidents_df = pd.DataFrame(incidents)
    areas_df = pd.DataFrame(areas)

    # Step 2: Aggregate incident stats per area
    incident_stats = incidents_df.groupby('area').agg(
        total_incidents=('_id', 'count'),
        avg_response_time=('responseTimeMinutes', 'mean'),
    ).reset_index()

    # Step 3: Count high/critical severity incidents per area
    high_severity = incidents_df[incidents_df['severity'].isin(['high', 'critical'])]
    high_severity_counts = (
        high_severity.groupby('area')
        .size()
        .reset_index(name='high_severity_count')
    )

    # Step 4: Merge everything onto the areas table
    areas_df = areas_df.rename(columns={'_id': 'area'})
    dataset = areas_df.merge(incident_stats, on='area', how='left')
    dataset = dataset.merge(high_severity_counts, on='area', how='left')

    # Step 5: Fill missing values sensibly
    dataset['total_incidents'] = dataset['total_incidents'].fillna(0)
    dataset['high_severity_count'] = dataset['high_severity_count'].fillna(0)
    dataset['avg_response_time'] = dataset['avg_response_time'].fillna(
        dataset['avg_response_time'].mean()
    )

    # Step 6: Create the target label
    # An area is "high risk" if its high-severity incident count is in the
    # top 40% (i.e. at or above the 60th percentile) across all areas.
    threshold = dataset['high_severity_count'].quantile(0.6)
    dataset['is_high_risk'] = (dataset['high_severity_count'] >= threshold).astype(int)

    # Step 7: Select the final feature set
    feature_cols = [
        'population',
        'populationDensity',
        'infrastructureCondition',
        'distanceToHospitalKm',
        'total_incidents',
        'avg_response_time',
    ]

    dataset = dataset[feature_cols + ['is_high_risk', 'name']].dropna()

    # Step 8: Report what we built
    print(f"\nFinal dataset shape: {dataset.shape}")
    print(f"High-risk areas: {dataset['is_high_risk'].sum()} / {len(dataset)}")
    print("\nSample:")
    print(dataset.head())

    return dataset


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    df = build_dataset()
    output_path = Path(__file__).resolve().parent / "area_risk_dataset.csv"
    df.to_csv(output_path, index=False)
    print(f"\nSaved to {output_path}")