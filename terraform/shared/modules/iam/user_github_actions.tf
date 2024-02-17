resource "aws_iam_user" "github_actions" {
  name = "github"
}

resource "aws_iam_access_key" "github_actions" {
  user = aws_iam_user.github_actions.name
}

resource "aws_iam_policy" "github_actions" {
  name        = "AssumeRolePolicy"
  description = "Allows user to assume the specified role"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "sts:AssumeRole",
          "sts:TagSession"
        ],
        Effect = "Allow",
        Resource = aws_iam_role.github_actions_user_role.arn
      },
      {
        Action = "iam:PassRole",
        Effect = "Allow",
        Resource = aws_iam_role.github_actions_user_role.arn,
        Condition = {
          StringEquals = {
            "iam:PassedToService" = "sts.amazonaws.com"
          }
        }
      },
    ],
  })
}

resource "aws_iam_policy_attachment" "github_actions" {
  name       = "AssumeRolePolicyAttachment"
  users      = [aws_iam_user.github_actions.name]
  policy_arn = aws_iam_policy.github_actions.arn
}
