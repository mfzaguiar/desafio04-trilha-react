import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import Food from '../../components/Food';
import { FoodsContainer } from './styles';

interface FoodInput {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

type FoodAddandUpdateInput = Omit<FoodInput, 'id'>;


function Dashboard() {
  const [modalOpen , setmodalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood , seteditingFood] = useState<FoodInput>({} as FoodInput);
  const [foods, setFoods] = useState<FoodInput[]>([]);
  
  useEffect(() => {
    async function initialLoading() {
      const response = await api.get('/foods');
      setFoods(response.data);
  }
    initialLoading();
  },[])


  async function handleAddFood(food: FoodAddandUpdateInput) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function  handleUpdateFood(food: FoodAddandUpdateInput) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      
      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setmodalOpen(!modalOpen);
  }

  function toggleEditModal(){
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodInput) {
    seteditingFood(food);
    setEditModalOpen(true);
  }
  
    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                available={food.available}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
};

export default Dashboard;
