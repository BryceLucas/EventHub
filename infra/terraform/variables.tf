variable "project_name" {
  type        = string
  description = "Project name for tagging and resource grouping"
  default     = "EventHub"
}

variable "aws_region" {
  type        = string
  default     = "us-east-2"
}

variable "github_owner" {
  type        = string
  description = "GitHub username or org name"
  default     = "BryceLucas"
}

variable "github_repo" {
  type        = string
  description = "Repo name"
  default     = "EventHub"
}

variable "github_token" {
  type        = string
  sensitive   = true
  description = "GitHub personal access token for Amplify connection"
}
