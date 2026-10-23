// La nebulosa del inicio: unas pocas nubes enormes y muy difusas que, superpuestas,
// se leen como un único degradado. Cada una se desplaza apenas, ida y vuelta, con un
// período distinto, así la forma cambia de a poco sin que se note ningún contorno.
// Solo se animan transform y opacity, que el navegador resuelve sin recalcular el dibujo.
const FondoNebulosa = () => {
  return (
    <div className="nb-nebulosa" aria-hidden="true">
      <div className="nb-nube nb-nube-azul" />
      <div className="nb-nube nb-nube-violeta" />
      <div className="nb-nube nb-nube-cian" />
      <div className="nb-nube nb-nube-banda" />
      <div className="nb-nube nb-nube-brillo" />
      <div className="nb-nebulosa-grano" />
    </div>
  );
};

export default FondoNebulosa;
