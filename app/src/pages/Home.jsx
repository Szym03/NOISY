import { categories, sounds } from "../config/sounds";
import CategoryColumn from "../components/CategoryColumn";

function Home() {
  return (
    <div>
      <h1 className="welcome-heading">welcome to noisy</h1>
      <p className="welcome-subheading">pick a sound!</p>

      <div className="category-row">
        {categories.map((category) => {
          const categorySounds = sounds.filter(
            (sound) => sound.categoryId === category.id,
          );
          return (
            <CategoryColumn
              key={category.id}
              category={category}
              sounds={categorySounds}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;