

export default async function getTwitterEmbeds(res, req){
    const twitterPosts = req.twitterLinks

    const tweetInHTML = [];

    for(tweet in twitterPosts){
        const response = await axios.get(`https://publish.twitter.com/oembed?url=${tweet}`)
        tweetInHTML.push(response.html)
        console.log(response.html)

    }
}