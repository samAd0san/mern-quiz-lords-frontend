# Getting Started with Create React App
```
npx create-react-app .
npm start
```

# Installing Redux
- ```npm i @reduxjs/toolkit```

# Redux
1. <b>question_reducer.js</b>: Create this first to define how questions and answers are managed.
2. <b>result_reducer.js</b>: Create this second for managing results.
3. <b>store.js</b>: Create this last to combine reducers and set up the store.

- <b>createSlice</b> - A function that accepts an initial state, an object full of reducer functions, and a "slice name", and automatically generates action creators and action types that correspond to the reducers and state.