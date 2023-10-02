import AWS from 'aws-sdk';

// You will get the keys from going into your profile and Security from there
AWS.config.update({
    accessKeyId: '', // Access Key from AWS
    secretAccessKey: '', // Secret Key from AWS
    region: 'us-east-1' // Region
});

// Initialise dynamoDB
const dynamoDB = new AWS.DynamoDB();
const tableName = 'urls'; // Table name in Dynamo DB

// Function to insert long and short url in dynamo DB
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

// Function to get short url corresponding to long url. Key of database is short_url and value long_url
// So, we are doing a scan here to find the long_url which is O(n) -> To make it better, we can put a secondary index in db.
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

// Get long URL corresponding to short
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
