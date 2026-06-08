import json
from minio import Minio
from minio.error import S3Error
import os
from dotenv import load_dotenv

load_dotenv()

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "127.0.0.1:9000")
MINIO_PUBLIC_ENDPOINT = os.getenv("MINIO_PUBLIC_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_SECURE = os.getenv("MINIO_SECURE", "False").lower() in ("true", "1", "t")
MINIO_BUCKET_NAME = "bookmyvenue-images"

minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=MINIO_SECURE,
)


def init_minio():
    try:
        found = minio_client.bucket_exists(MINIO_BUCKET_NAME)
        if not found:
            minio_client.make_bucket(MINIO_BUCKET_NAME)
            print(f"Created MinIO bucket: {MINIO_BUCKET_NAME}")

            # Set public read policy
            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": ["*"]},
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{MINIO_BUCKET_NAME}/*"],
                    }
                ],
            }
            minio_client.set_bucket_policy(MINIO_BUCKET_NAME, json.dumps(policy))
            print(f"Set public read policy on bucket: {MINIO_BUCKET_NAME}")
        else:
            print(f"MinIO bucket '{MINIO_BUCKET_NAME}' already exists")
    except S3Error as err:
        print(f"MinIO error: {err}")
