import './App.css'
import Header from './components/header'
import ProductCard from './components/productCard'

function App() {

  return (
    <>
        <Header/>
        <ProductCard name="Apple Laptop" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, maxime." price="1000/=" picture="https://picsum.photos/id/1/200/300" />
        <ProductCard name="Gaming Laptop" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, maxime." price="1000/=" picture="https://picsum.photos/id/3/200/300" />
    </>
  )
}

export default App
