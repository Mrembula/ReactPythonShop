import styles from './Card.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Card = ({products, handleCardClick}) => {

    return (
        <>
            <div className="product__sale">
                <div className={`${styles.CardContainer} px-lg-2 d-flex flex-wrap`}>
                        {products.map((product) => (
                            <div className={`${styles.Card} ${styles.CardSize} card`}
                                 key={product.id}
                                 onClick={() => handleCardClick(product)}>
                                <div className={`${styles.ImageContainer}`}>
                                <img src={product.image_url}
                                     className={`card-img-top ${styles.CardImg}`}
                                     alt={product.name}
                                /></div>
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">$ {product.price}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}

export default Card;
