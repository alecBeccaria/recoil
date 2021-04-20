
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, } from 'react-native';
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

function Todolist() {
  const todos = useRecoilValue(todoListState);
  return(
    <View style={styles.todoList}>
      {todos.map((todoItem) => (
        <Todo key={todoItem.id} item={todoItem}/>
      ))}
      <TodoForm />
    </View>
  )
}



function Todo({item, key}) {
  const [todoList, setTodoList] = useSetRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });
    setTodoList(newList);
  }

  function replaceItemAtIndex(arr, index, newValue) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
  }

  return (
    <View style={styles.todo}>
      <Text style={{ textDecoration: item.isComplete ? "line-through" : ""}}>
      {item.text}
      </Text>
      
      <View style={{flexDirection: 'row', width: 200, alignContent: 'space-between'}}>
        <Button onPress={() => toggleItemCompletion()} title="Complete"/>
        <Button onPress={() => removeTodo(index)} title="X"/>
      </View>
    </View>
  );
};

function TodoForm() {
  const [value, setValue] = React.useState("")
  const setTodoList = useSetRecoilState(todoListState);

  let id = 4;
  function getId() {
    return id++;
  }


  // const handleSubmit = e => {
  //   e.preventDefault();
  //   if (!value) return; 
  //   addTodo(value);
  //   setValue("");
  // };

  const addItem = () => {
    if (!value) return;
    setTodoList((oldList) => [
      ...oldList,
      {
        id: getId(),
        text: value,
        isComplete: false,
      }
    ]);
    setValue("");
  }

  return(
    <View>
      <TextInput style={styles.input} value={value}
        onChange={e => setValue(e.target.value)}
        onKeyPress={e => {
          if(e.keyCode == 13) addItem()
        }}
      />
    </View>
  );
}

function App() {
  return (
    <RecoilRoot>
      <View style={styles.app}>
        <Todolist/>
      </View>
    </RecoilRoot>
  );
}


export default App;

const styles = StyleSheet.create({
  todo: {
    flex: 'display',
    flexDirection: "row",
      height: 100,
      padding: 20,
    alignItems: 'center',
    background: '#fff',
    borderRadius: '3px',
    boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    fontSize: '12px',
    justifyContent: 'space-between',
    marginBottom: '6px',
    padding: '3px 10px',
  },
  app: {
  background: '#209cee',
  height: '100vh',
  padding: '30px'
  },
  todoList: {
  background: '#e8e8e8',
  borderRadius: '4px',
  maxWidth: '400px',
  padding: '5px',
  display:'flex',
  flexFlow: 'column nowrap'
  }
})
