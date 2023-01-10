export const environment = {
  production: true,
  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  // api_url: 'https://apidiagnochiledes.azurewebsites.net/',
  api_url: 'https://apidiagnochile.azurewebsites.net/',
  auth:'login',
  key_encript:'',
  headerToken : {'Authorization': `Bearer ${localStorage.getItem('token')}`},
  login:'login',
  register: 'login/newUser' 
};
