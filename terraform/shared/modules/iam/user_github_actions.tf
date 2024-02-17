resource "aws_iam_user" "github_actions" {
  name = "github"
}

resource "aws_iam_access_key" "github_actions" {
  user = aws_iam_user.github_actions.name
}
