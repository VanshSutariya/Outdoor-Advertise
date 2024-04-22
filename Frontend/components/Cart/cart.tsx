import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { cartActions } from "../../store/cart-slice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [checkout, setCheckout] = useState(false);
  const { userId }: { userId: string | null } = useSelector(
    (state: RootState) => state.auth
  );
  const { items, finalTotal } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const func = async () => {
      try {
        const res = await fetch(`http://localhost:4000/cart?userId=${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch cart data.");
        }
        const data = await res.json();
        console.log(data);

        // Dispatch an action to update Redux state with fetched cart data
        dispatch(cartActions.setCartItems(data));
      } catch (error) {
        console.error("Error fetching cart data:", error.message);
      }
    };
    func();
  }, [userId]);

  const openModal = () => {
    const modalElement = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement | null;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  const closeModal = () => {
    const modalElement = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement | null;
    if (modalElement) {
      modalElement.close();
    }
  };

  function handleDelete(posterId) {
    dispatch(cartActions.removeItem({ userId, posterId }));
  }

  function handleEdit(posterId) {
    dispatch(cartActions.removeItem({ userId, posterId }));
    closeModal();
    router.push(`/poster/${posterId}`);
  }

  async function handleCheckout() {
    setCheckout(true);
    try {
      const response = await fetch("http://localhost:4000/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(items),
      });

      if (response.ok) {
        const data = await response.text();
        router.push(data);
      } else {
        throw new Error("Error creating checkout session.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <button className="btn bg-transparent" onClick={openModal}>
        <img src="/shopping-cart.png" alt="Logo" className=" h-[35px]" />
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Your Cart</h3>
          <div className="pt-4 flex-col ">
            {!checkout &&
              items &&
              items.map((item) => (
                <div
                  key={item.posterId}
                  className="w-full flex pt-2 border-b-slate-400 border-b-[2px] pb-2 "
                >
                  <div className="flex  w-full">
                    <img
                      src={item?.image}
                      alt="an poster image"
                      className="w-[80px] h-[80px] rounded-xl"
                    />
                    <div className="ml-4">
                      <p className="text-[18px]">{item?.title}</p>
                      <p className="text-[12px]">{item?.address}</p>
                      <button
                        onClick={() => handleEdit(item?.posterId)}
                        className=" bg-slate-200 p-2 ml-3  rounded-xl hover:bg-slate-300 active:bg-slate-100 "
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="flex-col mt-3 ">
                    <p className="mb-1 ">₹{item?.totalPrice}</p>
                    <button
                      onClick={() => handleDelete(item?.posterId)}
                      className="bg-slate-200 p-2 rounded-xl hover:bg-slate-300 active:bg-slate-100 "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
          {!checkout && (
            <p className="flex justify-end pt-2 pb-2 text-lg">
              TotalPrice: ₹{finalTotal}{" "}
            </p>
          )}
          <div className=" ">
            <form method="dialog" className="flex">
              <div className="flex w-full">
                <button className="btn" onClick={closeModal}>
                  Close
                </button>
              </div>
              <button className="btn" onClick={handleCheckout}>
                Checkout
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default Cart;
