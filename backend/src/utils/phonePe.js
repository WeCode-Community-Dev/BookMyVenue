import { StandardCheckoutClient, Env } from 'pg-sdk-node';
 
const clientId = "M22G86ILJZX5A_2606151747";
const clientSecret = "NzVkMWIxZmEtZGMzNS00ZjM1LWFlNmUtYzI4NjQ1ZjkyYzE4";
const clientVersion = 1;  //insert your client version here
const env = Env.SANDBOX;      //change to Env.PRODUCTION when you go live
 
export const phonePeClient = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);