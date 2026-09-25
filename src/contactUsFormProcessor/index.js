import https from 'node:https';
import querystring from 'node:querystring';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const corsHeaders = {
    "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
};

function response(statusCode, body) {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify(body)
    };
}

function verifyRecaptcha(postData) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'www.google.com',
            port: 443,
            path: '/recaptcha/api/siteverify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            res.setEncoding('utf8');
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(responseBody));
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

export const handler = async(event) => {
    // Validate the recaptcha
    const input_data = JSON.parse(event.body);
    const postData = querystring.stringify({
        'secret': process.env.ReCaptchaSecret,
        'response': input_data['g-recaptcha-response']
    });

    try {
        const captchaResponse = await verifyRecaptcha(postData);
        if (!captchaResponse.success || captchaResponse.score <= 0.5) {
            return response(500, {message: 'Invalid recaptcha or low trust score'});
        }

        delete input_data['g-recaptcha-response'];
        let message = '';
        Object.keys(input_data).forEach(function(key) {
            message += key + ': ';
            message += input_data[key] + '\n';
        });
        const params = {
            Message: message,
            Subject: process.env.Subject,
            TopicArn: process.env.ContactUsSNSTopic
        };
        const snsClient = new SNSClient({});
        const snsResponse = await snsClient.send(new PublishCommand(params));
        return response(200, snsResponse);
    } catch (error) {
        return response(500, {message: error.message});
    }
};
