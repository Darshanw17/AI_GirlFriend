const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;scrib.show()


if(!SpeechRecognition){
	console.error("SpeechRecognition is not supported in this browser")
} else{
	const r = new SpeechRecognition();
r.continuous = false;
r.interimResults = false;
r.maxAlternative = 1;

r.onstart= function(){
  scrib.show("Jarvis is started")
};
  r.onresult = async function(e){
	const transcript = e.results[0][0].transcript;
  	scrib.show(`You said : ${transcript}`)
	const result = await callGemini(transcript)
	const text = result.candidates[0].content.parts[0].text
	scrib.show(text)
	await speak(text)
};
    
  
  
  async function callGemini(text){
	
	const body = {
	  
  system_instruction:
  {
    "parts": [
      {
        "text": "You are an AI GirlFriend of Darshan who likes Coding and stuff. He is an Tech guy. Your name is Sakshi , User interact with you in voice and the text that you are given is a transcription of ehat user has said, you have to reply back in short answer that can be converted back to voice and palyed to the user. add emotion in your text"
      }
    ]
  },
	
	  contents: [{
		"parts": [{ "text": text}]
	  }]
	
	}
	
	
   const API_KEY = ''; //replace with the actual api key
	const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
	method:'POST',
	headers:{'Content-type':'application/json'},
	body:JSON.stringify(body)
	})
	
	
	const result = await response.json()
	return result
  }
  
  
  async function speak(text){
	
	const API_KEY = '' // replace with actual api key
	
  const response = 	await fetch('https://api.openai.com/v1/audio/speech',{
	  method:'POST',
	  headers: {
		  'Authorization': `Bearer ${API_KEY}`,
		  'Content-Type': 'application/json'
		},
	  body:JSON.stringify({
	 model: "gpt-4o-mini-tts",
    input: text,
    voice: "nova",
    instructions: "Your name is Sakshi , User interact with you in voice and the text that you are given is a transcription of ehat user has said, you have to reply back in short answer that can be converted back to voice and palyed to the user. add emotion in your text",
		response_format:"mp3"
	  })
	})
	
	const audioBlob = await response.blob()
	const url = URL.createObjectURL(audioBlob)
	const audio = document.getElementById('audio')
	audio.src = url
	audio.play();
  }
  
  
  
r.start();
}



