import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://20.244.56.144/evaluation-service';
const API_TOKEN = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2NjI4ODk5LCJpYXQiOjE3NDY2Mjg1OTksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjM4NmY1NmExLWY3MjQtNDJlZS1iNmIzLTE3ZDE0OGY5YjZmMiIsInN1YiI6ImFuYW5kZGFnYTIwMDNAZ21haWwuY29tIn0sImVtYWlsIjoiYW5hbmRkYWdhMjAwM0BnbWFpbC5jb20iLCJuYW1lIjoiYW5hbmQgZGFnYSIsInJvbGxObyI6IjRuaTIyY3MwMjMiLCJhY2Nlc3NDb2RlIjoiRFJZc2NFIiwiY2xpZW50SUQiOiIzODZmNTZhMS1mNzI0LTQyZWUtYjZiMy0xN2QxNDhmOWI2ZjIiLCJjbGllbnRTZWNyZXQiOiJIWHNkeVRCVWdDWkFDaEtTIn0.Zl-kiSu9lKdrIor7DxreBZLd-AUM0haBmIXeRWdO_0s"
export const getTopUsersByComments = async (req: Request, res: Response) => {
  try {
    const usersRes = await fetch(`${BASE_URL}/users`, {
      headers: {
        Authorization: `${API_TOKEN}`,
      },
    });
    if (!usersRes.ok) throw new Error('Failed to fetch users');

    const usersData = await usersRes.json();
    const users = usersData.users;

    const results: {
      userId: number;
      name: string;
      totalComments: number;
    }[] = [];

    const userIds = Object.keys(users);

    for (const id of userIds) {
      const userId = parseInt(id);
      const userName = users[id];

      try {
        const postsRes = await fetch(`${BASE_URL}/users/${userId}/posts`, {
          headers: {
            Authorization: `${API_TOKEN}`,
          },
        });

        if (!postsRes.ok) continue;

        const postsData = await postsRes.json();
        const posts = postsData.posts;

        let commentCount = 0;

        for (const post of posts) {
          try {
            const commentsRes = await fetch(`${BASE_URL}/posts/${post.id}/comments`, {
              headers: {
                Authorization: `${API_TOKEN}`,
              },
            });

            if (!commentsRes.ok) continue;

            const commentsData = await commentsRes.json();
            commentCount += commentsData.comments.length;
          } catch {
            console.warn(`Error fetching comments for post ${post.id}`);
          }
        }

        results.push({
          userId,
          name: userName,
          totalComments: commentCount,
        });
      } catch {
        console.warn(`Error fetching posts for user ${userId}`);
      }
    }

    console.log(results)

    const topUsers = results
      .sort((a, b) => b.totalComments - a.totalComments)
      .slice(0, 5);

     res.json(topUsers);
  } catch (error) {
    console.error(error);
     res.status(500).json({ error: 'Something went wrong' });
  }
};
