import { Link } from "react-router-dom";

function CategoryColumn({ category, sounds }) {
  // TODO: decide how many to show (3) vs how many exist (sounds.length)
  // const visible = sounds.slice(0, 3);
  // const remaining = sounds.length - visible.length;

  return (
    <div /* TODO: apply category.gradientFrom / gradientTo as a background */>
      <h2>{category.title}</h2>

      {/* TODO: map `visible` sounds, each as a Link to `/sound/${sound.id}`
          with sound.title and sound.description underneath */}

      {/* TODO: if remaining > 0, render a "more..." link/expand control */}
    </div>
  );
}

export default CategoryColumn;