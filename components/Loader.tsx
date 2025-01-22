

const loader = ({mainText, secondaryText = "Please wait"}: {mainText:string, secondaryText?: string}) => {
    if (!mainText) {
        mainText = "Loading...";
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center flex-col z-50 ">
            
            <div className="bg-transparent p-8 rounded-full border-4 border-gray-300 shadow-lg border-b-0 transition-all duration-500 animate-spin">                        
            </div>  
            <div className="p-8 ">
                <h2 className="text-2xl font-bold text-center">{mainText}</h2>
                <p className="text-center">{secondaryText}</p>
            </div>
        </div>
    );
    }

export default loader;