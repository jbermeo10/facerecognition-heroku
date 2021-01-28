import React , { useState } from "react";
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Logo from './components/logo/Logo';
// import Clarifai from 'clarifai';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import './App.css';

// // d96509c073e640dc98238149d6c4fc34 another API key that I have
// let app = new Clarifai.App({apiKey: '5b03a67ea9fc4b528a408c4c2e7fe778'});

const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  iniInput: '',
  iniImageUrl: '',
  iniBox: {},
  iniRoute: 'signin',
  iniIsSignedIn: false,
  iniUser: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: new Date()
  }
}

function App() {
  const [input, setInput] = useState(initialState.iniInput);
  const [imageUrl, setImageUrl] = useState(initialState.iniImageUrl);
  const [box, setBox] = useState(initialState.iniBox);
  const [route, setRoute] = useState(initialState.iniRoute);
  const [isSignedIn, setIsSignedIn] = useState(initialState.iniIsSignedIn);
  const [user, setUser] = useState(initialState.iniUser);

  // useEffect(()=>{
  //   fetch('http://localhost:3000/')
  //     .then(response => response.json())
  //     .then(data => console.log(data));
  // }, [])

  const calculateFaceLocation = (data) => {
    // console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (obj) => {
    // console.log(obj);
    setBox(obj);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onButtonSubmit = () => {
    setImageUrl(input);
    // app.models
    //   .predict({
    //   // id:'MODEL_ID', 
    //   // id: Clarifai.FACE_DETECT_MODEL,
    //   // id: 'c0c0ac362b03416da06ab3fa36fb58e3'
    //   id: 'd02b4508df58432fbb84e800597b8959'
    //   // version:'MODEL_VERSION_ID' //  optional
    //   }, 
    //   // "https://samples.clarifai.com/face-det.jpg")
    //   input)
    fetch('https://nameless-castle-69800.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input: input,
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://nameless-castle-69800.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: user.id,
          })
        })
        .then(response => response.json())
        .then(count => {
          // setUser({ entries: count });
          setUser({
            entries: count,
            id: user.id,
            name: user.name,
            email: user.email,
            joined: user.joined
          })
        })
        .catch(err => console.log('Error de imagen fetch:', err))
      }
      displayFaceBox(calculateFaceLocation(response));
      })
    .catch(err => console.log('Este fue el error:',err));   
  }

  const onRouteChange = (ruta) => {
    if (ruta === 'signout') {
      // setIsSignedIn(false);
      setInput(initialState.iniInput);
      setImageUrl(initialState.iniImageUrl);
      setBox(initialState.iniBox);
      setRoute(initialState.iniRoute);
      setIsSignedIn(initialState.iniIsSignedIn);
      setUser(initialState.iniUser);
    } else if (ruta === 'home') {
      setIsSignedIn(true);
    }
    setRoute(ruta);
  }

  const loadUser = (usuario) => {
    setUser({
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      entries: usuario.entries,
      joined: usuario.joined
    });
  }
  
  return (
    <div className="App">
      <Particles className='particles'
        params={particleOptions}
      />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      { route === 'home'
        ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries}/>
            <ImageLinkForm 
              onInputChange={onInputChange}  
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
        : (
          route === 'register'
            ? <Register onRouteChange={onRouteChange} loadUser={loadUser}/>
            : <Signin onRouteChange={onRouteChange} loadUser={loadUser}/>
          )
      }
    </div>
  );
}

export default App;
