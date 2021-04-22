import React from 'react';
import { StyleSheet, Button, Text, TextInput, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';


const todoListState = atom({
  key: 'todoListState', 
  default: [
    {id: 1, text: "Learn about React Native", isComplete: false},
    {id: 2, text: "Learn about Recoil", isComplete: false},
    {id: 3, text: "Go sleep!", isComplete: false}
  ],
});

const todoListFilterState = atom({
  key: 'todoListFilterState',
  default: 'Show All'
});

const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({get}) =>{
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch(filter) {
      case 'Show Completed':
        return list.filter((item) => item.isComplete);
      case 'Show Uncompleted':
        return list.filter((item) => !item.isComplete);
        default:
          return list;
    }
  }
})



function TodoListFilters() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);

  const updateFilter = (value) => {
    setFilter(value);
  };

  return (
    <View>
      <Text>Filter:</Text>
      <RadioButton.Group
        onValueChange={value => updateFilter(value)} value={filter}>
        <View>
          <Text>All</Text>
          <RadioButton value="Show All" />
        </View>
        <View>
          <Text>Completed</Text>
          <RadioButton value="Show Completed" />
        </View>
        <View>
          <Text>Uncompleted</Text>
          <RadioButton value="Show Uncompleted" />
        </View>
      </RadioButton.Group>
    </View>
  );
}

function GetStats() {
  const todos = useRecoilValue(todoListState);
  let listNumTotal;
  let listNumComplete;
  let listNumIncomplete;
  let listNumPercent;
 for (let i = 0; i < todos.length; i++) {
  todos.map((isComplete, i) => {
     
  })
 }
  return(
      <View>
        <Text>{listNumTotal}</Text>
      </View>
  );
  
}

function TodoList() {
  const todos = useRecoilValue(filteredTodoListState);

  return (
    <View style={styles.todoList}>
      <TodoListFilters/>
      <GetStats fullArr={todoListState}/>
      {todos.map((todoItem) => (
        <Todo key={todoItem.id} item={todoItem}/>
      ))}
      <TodoForm/>
    </View>
  )
}

function Todo({item}) {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });
    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = [...todoList];
    newList.splice(index, 1);
    setTodoList(newList);
  };

  

  function replaceItemAtIndex(arr, index, newValue) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
  }
  

  return(
    <View style={styles.todo}>
      <Text style={{ textDecoration: item.isComplete ? "line-through" : "" }}>
      {item.text}
    </Text>
      <View style={{flexDirection: 'row', width: 200, alignContent: 'space-between'}}>
        <Button onPress={toggleItemCompletion} title="Complete"/>
        <Button onPress={deleteItem} title="X"/>
        {/* <GetStats arr={todoList}/> */}
      </View>
    </View>
  );
}

function TodoForm() {
  const [text, setText] = React.useState("");
  const setTodoList = useSetRecoilState(todoListState);

  let id = 4;
  function getId() {
    return id++;
  }

  const addItem = () => {
    if(text.length == 0) return;
    setTodoList((oldTodoList) => [
      ...oldTodoList,
      {
        id: getId(),
        text: text,
        isComplete: false,
      },
    ]);
    setText('');
  };

  return (
    <View>
      <TextInput style={styles.input} value={text}
        onChange={e => setText(e.target.value)}
        onKeyPress={e => {
          if(e.keyCode==13) addItem()
        }}
      />
      <Button onPress={addItem} title="Add"/>
    </View>
  );
}

function App() {
  return (
    <RecoilRoot>
      <View style={styles.app}>
        <TodoList/>
      </View>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: '#209cee',
    height: '100vh',
    padding: '30px',
  },
  todoList: {
    backgroundColor: '#e8e8e8',
    borderRadius: 4,
    maxWidth: '400px',
    padding: '5px',
    display: 'flex',
    flexDirection: 'column'
  },
  todo: {
    flex: 1,
    flexDirection: "row",
    height: 100,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 3,
    display: 'flex',
    fontSize: 12,
    justifyContent: 'space-between',
    marginBottom: '6px',
    padding: '3px 10px',
  },
  input: {
    border: '2px grey solid',
    margin: 4
  }
});

export default App;
