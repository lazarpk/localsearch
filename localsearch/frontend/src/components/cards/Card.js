import React, { useEffect, useState } from 'react';
import axios from "axios"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from 'react-modal';
import styles from "./Card.css"

export default function MediaCard(props) {

    const [values, setValues] = useState({
        displayed_what: "",
        displayed_where: "",
        opening_hours: "",
        average_rating: "",
        phone: ""
    });

    const [isOpen, setIsOpen] = useState(false);

    const [reviews, setReviews] = useState({
        ambiente: "",
        service: "",
        food: ""
    })
    const [openModal, setOpenModal] = useState(false);

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

    useEffect(() => {
        (async() => {
            await axios.get(`https://storage.googleapis.com/coding-session-rest-api/${props.id}`).then(res => {
                let new_array = []
                let result = []
                let currentDateTime = new Date();
                currentDateTime.setHours(11, 30, 0, 0)
                let todayDay = currentDateTime.getDay();
                let dayName = days[todayDay-1]
            
                let openingHours = res.data.opening_hours.days[dayName]
                openingHours.forEach(element => {
                    let openHour = new Date (currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), element.start.split(":")[0], element.start.split(":")[1])
                    let closeHour = new Date (currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), element.end.split(":")[0], element.end.split(":")[1])

                    if (currentDateTime >= openHour && currentDateTime < closeHour) {
                        setIsOpen(true);
                        return
                    } 
                });
                days.map((item, day_index)=> {
                    if (res.data.opening_hours.days[item]) {
                        if (res.data.opening_hours.days[item].length == 1) {
                            new_array.push({"name": item.charAt(0).toUpperCase() + item.slice(1), "hours": [{"start": res.data.opening_hours.days[item][0].start, "end": res.data.opening_hours.days[item][0].end}], type: "Open"})
                        } else{
                            res.data.opening_hours.days[item].map((array_item, index) => {
                                if (index == 0) {
                                    new_array.push({"name": item.charAt(0).toUpperCase() + item.slice(1), "hours": [{"start": array_item.start, "end": array_item.end}], type: "Open"})
                                } else {
                                    new_array[new_array.length - 1].hours.push({"start": array_item.start, "end": array_item.end})
                                }
                            })
                        }
                    } else {
                        new_array.push({"name": item.charAt(0).toUpperCase() + item.slice(1), "hours": [{"start": "", "end": ""}], "type": "Closed"})
                    }
                })
                new_array.map((item, index) => {
                    if (index != 0) {
                        if (item.type == new_array[index -1].type && item.hours.length == new_array[index -1].hours.length) {
                            let theSame = false
                            item.hours.map((new_item, new_index) => {
                                if (new_item.start == new_array[index -1].hours[new_index].start && new_item.end == new_array[index -1].hours[new_index].end) {
                                    theSame = true
                                } else {
                                    theSame = false
                                }
                            })
                            if (theSame) {
                                if (result[result.length -1].name.includes("-")) {
                                    result[result.length -1].name = result[result.length -1].name.split("-")[0] + "- " + item.name
                                } else {
                                    result[result.length -1].name = result[result.length -1].name + " - " + item.name
                                }
                            } else {
                                result.push(item)
                            }
                        } else {
                            result.push(item)
                        }
                    } else {
                        result.push(item)
                    }
                })
                setValues({displayed_what: res.data.displayed_what, displayed_where: res.data.displayed_where, opening_hours: result, average_rating: res.data.place_feedback_summary.average_rating, phone: res.data.addresses[0].contacts[0].call_link})
                setReviews({ambiente: res.data.place_feedback_summary.rating_summaries[0].average, service: res.data.place_feedback_summary.rating_summaries[1].average, food: res.data.place_feedback_summary.rating_summaries[2].average})
            })
        })()
    }, [])

    const handelClick = () => {
        setOpenModal(true);
    }

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '45%',
          height: '49vh',
          backgroundColor: "white",
          borderRadius: "10px"
        },
    };

    return (
        <>
        <Card sx={{ maxWidth: 300 }}>
        <CardMedia
            sx={{ height: 140 }}
            image={props.restaurantImage}
            title="restaurant"
        />
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {values.displayed_what}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                <i className="fa fa-star" aria-hidden="true" style={{marginRight: "2%", color: "yellow"}}></i>{parseFloat(values.average_rating).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary"> 
                {values.displayed_where}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" onClick={handelClick}>See more</Button>
        </CardActions>
        </Card>
        <Modal
            isOpen={openModal}
            onRequestClose={() => {setOpenModal(false)}}
            style={customStyles}
            ariaHideApp={false}
            >
            <div className={styles.cardContainer}>
                <div style={{width: "50%", float: "left"}}>
                    <div>
                        <img src={props.restaurantImage}/>
                    </div>
                    <h4>{values.displayed_what}</h4><br/>
                    <lable style={isOpen ? {color: "green"} : {color: "red"}}>{isOpen ? "Open" : "Closed"}</lable>
                    <h6>{values.displayed_where}</h6><br />
                    <span><i className="fa fa-phone" aria-hidden="true" style={{color: "green"}}></i> {values.phone}</span>
                </div>
                <div style={{width: "50%", float: "right"}}>
                    <h5>Opening hours</h5>
                    <table style={{width: "100%"}}>
                        <tbody>
                            {Object.keys(values.opening_hours).length != 0 ?
                            values.opening_hours.map(item => (
                                item.hours.length > 1 ?
                                    item.hours.map((row, index) => (
                                        index != 0 ?
                                        
                                            <tr key={item.name}>
                                                <td></td>
                                                <td style={{textAlign: "right"}}>{row.start} - {row.end}</td>
                                                
                                            </tr>
                
                                        : 
                                            <tr key={item.name}>
                                                <td>{item.name}</td>
                                                <td style={{textAlign: "right"}}>{row.start} - {row.end}</td>
                                            </tr>
                                    ))
                                : 
                                    <tr key={item.name}>
                                        <td>{item.name}</td>
                                        <td style={item.type == "Closed" ? {textAlign: "right", color: "red"} : {textAlign: "right"}}>{item.type == "Closed" ? "Closed" : `${item.hours[0].start} - ${item.hours[0].end}`}</td>
                                    </tr>
                                
                            ))
                            : ""}
                        </tbody>
                    </table><br />
                    <span>Feedback summary</span><br/>
                    <table style={{width: "100%"}}>
                        <tbody>
                            <tr>
                                <td>Ambiente</td>
                                <td><i className="fa fa-star" aria-hidden="true" style={{marginRight: "5%", color: "yellow"}}></i>({parseFloat(reviews.ambiente).toFixed(2)})</td>
                            </tr>
                            <tr>
                                <td>Service</td>
                                <td><i className="fa fa-star" aria-hidden="true" style={{marginRight: "5%", color: "yellow"}}></i>({parseFloat(reviews.service).toFixed(2)})</td>
                            </tr>
                            <tr>
                                <td>Food</td>
                                <td><i className="fa fa-star" aria-hidden="true" style={{marginRight: "5%", color: "yellow"}}></i>({parseFloat(reviews.food).toFixed(2)})</td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
            </div>
        </Modal>
        </>
    );
}