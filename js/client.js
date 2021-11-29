console.log('Hello World!');

const init = async () => {
  const response = await fetch('https://graph.instagram.com/4445844762200108/media?fields=id,%20caption,link,media_url&access_token=IGQVJXb2dxeU9mRXNUT0NWM2xJZAnlFU3BoSkpfSDloV3dLa2M3VUE0TVlHUXJmVGVYM2VsaGxLczdRS0xGbUFaMjhqYW1fNGttdEdvRHpxa2F2Sk1seDYzUTRlcVhmd3ZALQTZAOdXlVUDl0ZA3ZACOFlTbgZDZD');
  const data = await response.json();

  const lunchFigure = data.data.find((item) => item.caption.startsWith('#lunch'));

  document.querySelector('.container').innerHTML = `
    <figure>
      <img src="${lunchFigure.media_url}" alt="Tony's image">
      <figcaption>${lunchFigure.caption}</figcaption>
    </figure>
  `
  console.log(data);
}

init();