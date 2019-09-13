import { link } from "fs";
const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibilityFilter
});
const { createStore } = Redux;
const store =createStore(todoApp);

const { Component } = React;

// The link component now only 
// specifies how the linke loks wheethere it is active ot inactive
const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{children}</span>;
  }

  return (
    <a href='#'
    onClick={e => {
      e.proventDefault();
      onClick(filter);
    }}
    >
      {children}
    </a>
  );
};

const todo = (state, action) => {

}

// KM This is a reducer
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
        return state.map(t =>
          todo(t, action)
      );
    default:
      return state;
  }
}

// Visibility Reducer
const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

const Footer = () => (
    <p>
      Show:
      {' '}
      <FilterLink
        filter='SHOW_ALL'
      >
      All 
      </FilterLink>
      {', '}
      <FilterLink
        filter='SHOW_ACTIVE'
      >
      Active
      </FilterLink>
      {', '}
      <FilterLink
        filter='SHOW_COMPLETED'
      >
      Completed
      </FilterLink>
    </p>
)

// This is a container compoenent so doesnt't have its own markup
// It delegates rendering to the Link proesentational component
// This provides the data and the behaviour for the presentational component

class FilterLink extends Component {
  // This calls forceUpdate antine tthe store changes this re-renders the screen
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
    this.forceUpdate()
    );
  }

  // Very important that the component unsubscribes
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
        active={
          // It compates its active filter prop with the 
          // filter in the redux state 
           props.filter ===
           state.visibilityFilter
        }
        onClick{() => 
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
        >
          {props.children}
        </Link>
    );
  }
}
// Presentational Component
const Todo = ({
  onClick, 
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
        completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
);


// Presentational Component
const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
        />
    )}
  </ul>
);

// Presentational component does not express behaviours
const AddTodo = ({
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            id: newxtTodoId,
            text: input.value
        })
        input.value = '';

      }}>
        Add Todo
      </ button> 
    </div>
  );
};



const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed);
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
  }
};
class VisibleTodoList extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
    this.forceUpdate()
    );
  }

  // Very important that the component unsubscribes
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();
    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }
      />
    );

  }
}
let nextTodoID = 0;

// This is a container component
// All container components are similar, their job is to connect a presentational component to the Redux store and specify teh data 
// and the behaviour that it needs
const TodoApp = () => 
  <div>
    <AddTodo
      /> 
    <VisibleTodoList />
    <Footer />                  
  </div>
);

ReactDOM.render(
    <TodoApp />,
      document.getElementById('root')
);