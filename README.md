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

- action/event = some operation we want to perform, like in counter we want to increment or decrement the value

- so REDUCER is a function that receives the current state and the action and then gives the new state, i.e (state, action) => newState

- DISPATCH is like triggering an event to occur


- The flow is like 
1. The initial state is saved in the store 
2. whenever we want to trigger some event/action it gets sends to the store
3. the store sends the current state and the event/action to the reducer, the reducer performs the operation and updates the existing state and sends it back to the store.
4. all the other components which are subscribed to the store will get updated 
