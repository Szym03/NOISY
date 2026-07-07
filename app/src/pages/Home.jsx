import { Link } from "react-router-dom";

import { categories, sounds } from "../config/sounds";
import CategoryColumn from "../components/CategoryColumn";

function Home() {
  // TODO: group `sounds` into arrays keyed by categoryId
  // hint: categories.map(category => sounds.filter(s => s.categoryId === category.id))

  return (
    <div>
      <h1 className="welcome-heading">welcome to noisy</h1>
      <p className="welcome-subheading">pick a sound!</p>
      <div>
        {/* TODO: map over categories, render a CategoryColumn per category,
            passing that category's sounds as a prop */}
      </div>
    </div>
  );
}

export default Home;