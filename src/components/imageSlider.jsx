export default function ImageSlider(props) {
    const images = props.images 
    return (
        <div className="w-[500px] h-[600px] bg-accent">
            <img className="w-full h-[500px]" />
            <div className="w-full h-[100px] flex justify-center items-center">
                {
                    images?.map(
                        (image,index) => {
                            return(
                                <img key={index} className="w-[90px] h-[90px] m-2 rounded-2xl" src={image} />
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}