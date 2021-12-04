const mongoose = require("mongoose");
const Event = mongoose.model("events");

const newEvent = async (req, res) => {
  const {
    title,
    venue,
    date,
    description,
    duration,
    status,
    registrationLink,
    updatedAt,
    slots,
  } = req.body;

  try {
    const existingEvent = await Event.findOne({ title });
    if (existingEvent) throw "event already exists";

    const image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
    }
    let newEvent = await new Event({
      title,
      venue,
      date,
      description,
      duration,
      status,
      registrationLink,
      updatedAt: new Date(),
      slots,
      image,
    }).save();
    console.log(newEvent);
    // res.status(200).json({ newEvent });
    res.redirect("/event");
  } catch (e) {
    console.error(e);
    res.status(300).json({ message: "something went wrong" });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events) throw "There are no events";

    const context = {
      events: events.map((event) => {
        return {
          title: event.title,
          description: event.description,
        };
      }),
    };
    res.render("events", { layout: "index", events: context.events });

    // res.status(200).json({events});
  } catch (e) {
    console.error(e);
    res.status(300).json({ message: "something went wrong" });
  }
};

const updateEvent = async (req, res) => {
  const {
    id,
    title,
    venue,
    date,
    description,
    duration,
    status,
    registrationLink,
    slots,
  } = req.body;
  try {
    if(req.file) {
      const image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
    }
    }
    
    let updateEvent = {
      title,
      venue,
      date,
      description,
      duration,
      status,
      registrationLink,
      updatedAt: new Date(),
      slots,
    };
    let response = await Event.findByIdAndUpdate(id,updateEvent);
    res.redirect("/event");

    // res.status(200).json({message:"Record Updated",response:response})
  } catch (error) {
    console.error(error);
    res.status(300).json({ message: "something went wrong" });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.body;
  try {
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event has been deleted" });
  } catch (e) {
    console.error(e);
    res.status(300).json({ message: "something went wrong" });
  }
};

const getEvent = async (req, res) => {
  const { id } = req.body;
  try {
    let response = await Event.findById(id);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
};

exports.getEvents = getEvents;
exports.getEvent = getEvent;
exports.newEvent = newEvent;
exports.deleteEvent = deleteEvent;
exports.updateEvent = updateEvent;

