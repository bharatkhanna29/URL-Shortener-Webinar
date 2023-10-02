import AWS from 'aws-sdk';
AWS.config.update({
    accessKeyId: '', // Access Key from AWS
    secretAccessKey: '', // Secret Key from AWS
    region: 'us-east-1' // Region
});

const dynamoDB = new AWS.DynamoDB();

const tableName = 'urls'; // Table name in Dynamo DB

export async function setLongToShort(longUrl, shortUrl) {
    const params = {
      TableName: tableName,
      Item: {
        short_url: {S: shortUrl},
        long_url: { S: longUrl }
      },
    };
  
    try {
      await dynamoDB.putItem(params).promise();
      console.log(`Set: Long URL "${longUrl}" -> Short URL "${shortUrl}"`);
    } catch (err) {
      console.error('Error setting key-value pair:', err);
    }
}

export async function getShortUrl(longUrl) {
    const params = {
      TableName: tableName,
      FilterExpression: 'long_url = :s',
      ExpressionAttributeValues: {
        ':s': { S: longUrl },
      }
    };
  
    try {
        console.log("scanning");
      const data = await dynamoDB.scan(params).promise();
      console.log(data);
      if (data.Items && data.Items[0] && data.Items[0].shortUrl) {
        return data.Items[0].shortUrl.S;
      }
      return null;
    } catch (err) {
      console.error('Error retrieving short URL:', err);
      return null;
    }
}

export async function getLongUrl(shortUrl) {
    const params = {
      TableName: tableName,
      Key: {
        'short_url': {S: shortUrl}
      }
    };
  
    try {
      const data = await dynamoDB.getItem(params).promise();
      console.log(data);
      if (data.Item && data.Item.long_url) {
        return data.Item.long_url.S;
      }
      return null;
    } catch (err) {
      console.error('Error retrieving long URL:', err);
      return null;
    }
}
