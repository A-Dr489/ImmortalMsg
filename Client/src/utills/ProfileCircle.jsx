

export default function ProfileCircle({first, last, width = "50px", height = "50px"}) {
    return (
        <>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", minWidth: width, height: height, borderRadius: "100px", border: "2px solid rgba(0, 255, 255, 0.692)", backgroundColor: "rgba(0, 255, 255, 0.18)", color: "cyan", boxShadow: "0px 0px 5px rgba(0, 255, 255, 0.35)", padding: "4px"}}>
                <h1 style={{fontSize: "1.6em"}}>{`${first[0].toUpperCase()}${last[0].toUpperCase()}`}</h1>
            </div>
        </>
    )
}
