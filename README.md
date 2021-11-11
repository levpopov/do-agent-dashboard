# Digital Ocean Droplet Monitoring

Pulls stats from [do-agent](https://github.com/digitalocean/do-agent) and renders them on a simple dashboard.

## How to use

1. Get a personal API token from [Digital Ocean](https://docs.digitalocean.com/reference/api/create-personal-access-token/)
2. Install [Vercel CLI](https://vercel.com/cli)
3. Deploy ```vercel --prod```
4. Set API token as ```DO_TOKEN``` [environment var](https://vercel.com/docs/concepts/projects/environment-variables) in Vercel console (under your new project settings).  
