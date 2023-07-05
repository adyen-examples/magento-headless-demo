export async function sendGraphQLReq(data) {
  try {
    const host = process.env.BASE_URL;
    const bearer = process.env.BEARER_TOKEN;
    var response;
    response = await fetch(host +'/graphql', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        'Content-Length': data.length,
        Authorization: 'Bearer '+ bearer,
        'Origin': host,
      },
      body: data,
    })
      .then((res) => res.json())
      //.then((result) => console.log( result))
      .then(result => response = result)
    return response;

  } catch (error) {
    console.error(error);
    alert("Error occurred. Look at console for details");
  }
}
