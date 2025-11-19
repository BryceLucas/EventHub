terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.3.0"
}

provider "aws" {
  region = var.aws_region
}

# -------------------------------------------------------
# S3 bucket for Terraform state (optional, but recommended)
# -------------------------------------------------------

resource "aws_s3_bucket" "eventhub_state" {
  bucket = "${var.project_name}-tf-state"
  force_destroy = true
}

resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.eventhub_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# -------------------------------------------------------
# IAM Roles for Amplify
# -------------------------------------------------------

resource "aws_iam_role" "amplify_service_role" {
  name = "${var.project_name}-amplify-service-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "amplify.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "amplify_policy" {
  name = "${var.project_name}-amplify-policy"
  role = aws_iam_role.amplify_service_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["amplify:*", "s3:*", "cloudfront:*"]
        Resource = "*"
      }
    ]
  })
}

# -------------------------------------------------------
# Amplify App (connected to your GitHub repo)
# -------------------------------------------------------

resource "aws_amplify_app" "eventhub" {
  name      = var.project_name
  repository = "https://github.com/${var.github_owner}/${var.github_repo}"

  build_spec = <<EOF
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
EOF

  oauth_token = var.github_token
  iam_service_role_arn = aws_iam_role.amplify_service_role.arn
}

# -------------------------------------------------------
# Amplify Branch (main)
# -------------------------------------------------------

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.eventhub.id
  branch_name = "main"
}
