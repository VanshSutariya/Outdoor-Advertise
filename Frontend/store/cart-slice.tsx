import { createSlice } from '@reduxjs/toolkit';
import { deleteAllCartData } from '../utils/http';

interface Item {
  _id: any;
  userId: string;
  posterId: string;
  image: string;
  title: string;
  totalPrice: number;
  address: string;
  bookingDate: string[];
}
interface cartState {
  items: Item[];
  finalTotal: number;
  cartId: string[];
}
const initialState: cartState = {
  items: [],
  finalTotal: 0,
  cartId: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action) {
      // Update state with fetched cart items
      state.items = action.payload || [];
      // Recalculate final total
      state.finalTotal = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );
    },
    addItemToCart(state, action) {
      const details = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.posterId === details.posterId && item.userId === details.userId,
      );
      if (!existingItem) {
        state.items.push({
          userId: details.userId,
          posterId: details.posterId,
          image: details.image,
          title: details.title,
          totalPrice: details.totalPrice,
          address: details.address,
          bookingDate: details.bookingDates,
          _id: '',
        });
        state.finalTotal += details.totalPrice;
        try {
          const data = async () => {
            const data = {
              userId: details.userId,
              posterId: details.posterId,
              image: details.image,
              title: details.title,
              totalPrice: details.totalPrice,
              address: details.address,
              bookingDate: details.bookingDates,
              createdBy: details.cretedBy,
            };

            const resData = await fetch('http://localhost:4000/cart/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            const response = await resData.json();

            if (!resData.ok) {
              throw new Error(response.message || 'enter valid data');
            }
          };
          data();
        } catch (error) {
          console.log(error.message);
        }
      }
    },
    removeItem(state, action) {
      const { posterId, userId } = action.payload;
      const existingItem = state.items.find(
        (item) => item.posterId === posterId && item.userId === userId,
      );
      console.log(existingItem);

      state.items = state.items.filter(
        (item) => item.posterId !== posterId && item.userId === userId,
      );
      state.finalTotal = state.finalTotal - existingItem.totalPrice;

      try {
        const data = async () => {
          const resData = await fetch(
            `http://localhost:4000/cart/${userId}/${posterId}`,
            {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            },
          );
          const response = await resData.json();
          console.log(response);
          if (!resData.ok) {
            throw new Error(response.message || 'Something went wrong.');
          }
        };
        data();
      } catch (error) {
        console.log(error.message);
      }
    },
    deleteWholeCart(state, action) {
      const userId = action.payload;
      try {
        const result = async () => {
          const resp = await deleteAllCartData(userId);
          console.log(resp);
          // state.items = [];
          // state.finalTotal = 0;
        };
        result();
      } catch (error) {
        console.error(error);
      }
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
