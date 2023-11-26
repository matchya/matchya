import json

# response_body {
# 	id: string
# 	name: string
# 	criteria: {
# 		repository_names: string[]
# 		messages: string[]        // messages for each criterion
# 	}
# 	candidates: [
# 		{
# 			first_name: string,
# 			last_name: string,
# 			email: string,
# 			github_username: string,
# 			total_score: number,
# 			summary: string,
# 			assessments: [
# 				{
# 					criterion: string
# 					score: number
# 					reason: string
# 				},
# 			]
# 		},
# 	]
# }

def retrieve(event, context):
    body = {
        "message": "Retrieve Position Lambda",
        "input": event,
    }

    return {"statusCode": 200, "body": json.dumps(body)}
