// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const queryData = req.body;
  const postData = {
    data: queryData.queryString
  };
  const formattedQueryString = new URLSearchParams(postData).toString();
  console.log(formattedQueryString);
  const resOverpass = await fetch(`https://overpass-api.de/api/interpreter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formattedQueryString
  });
  const data = await resOverpass.json();
  console.log(data);
  res.status(200).json({ name: 'John Doe' });
}
