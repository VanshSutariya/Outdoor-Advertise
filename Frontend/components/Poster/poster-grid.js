import classes from "./poster-grid.module.css";
import PosterItem from "./poster-item";

export default function PosterGrid({ meals }) {
  // return (
  //   <div className={classes.meals}>
  //     {meals.map((meal) => (
  //       <div key={meal.id}>
  //         <PosterItem {...meal} />
  //       </div>
  //     ))}
  //   </div>
  // );
  return (
    <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mx-auto justify-items-center ">
      {meals.map((meal) => (
        <div className="my-4 hover:shadow-2xl" key={meal.id}>
          <PosterItem {...meal} />
        </div>
      ))}
    </div>
  );
}
