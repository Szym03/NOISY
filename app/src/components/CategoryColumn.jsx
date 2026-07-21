import { Link } from "react-router-dom";

function CategoryColumn({ category, sounds }) {
  return (
    <div className="category-column"
      style={{
        background: `linear-gradient(to bottom, ${category.gradientFrom} 20%, ${category.gradientTo})`,
      }}>
      <h2 className="category-title">{category.title}</h2>

      {sounds.map((sound) => (
        <div key={sound.id} className="sound-entry">
          <Link to={`/sound/${sound.id}`} className="sound-link">
            {sound.title}
          </Link>
          <p className="sound-description">{sound.description}</p>
        </div>
      ))}
    </div>
  );
}

export default CategoryColumn;