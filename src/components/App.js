import React, { useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Popup from 'react-popup';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './../styles/App.css';

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');

  const handleSelectSlot = ({ start }) => {
    Popup.create({
      title: 'Create Event',
      content: (
        <CreateEventForm
          start={start}
          onSave={(event) => {
            setEvents([...events, { ...event, start, end: start }]);
            Popup.close();
          }}
        />
      )
    });
  };

  const handleSelectEvent = (event) => {
    Popup.create({
      title: 'Edit/Delete Event',
      content: (
        <EditEventForm
          event={event}
          onSave={(updatedEvent) => {
            setEvents(events.map(e => (e === event ? updatedEvent : e)));
            Popup.close();
          }}
          onDelete={() => {
            setEvents(events.filter(e => e !== event));
            Popup.close();
          }}
        />
      )
    });
  };

  const filteredEvents = events.filter(event => {
    const now = new Date();
    if (filter === 'Past') return event.start < now;
    if (filter === 'Upcoming') return event.start >= now;
    return true;
  });

  return (
    <div>
      {/* Do not remove the main div */}
      <div>
        <button className="btn" onClick={() => setFilter('All')}>All</button>
        <button className="btn" onClick={() => setFilter('Past')}>Past</button>
        <button className="btn" onClick={() => setFilter('Upcoming')}>Upcoming</button>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 500, margin: '20px' }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.start < new Date()
              ? 'rgb(222, 105, 135)'
              : 'rgb(140, 189, 76)',
          }
        })}
      />

      <Popup />
    </div>
  );
};

const CreateEventForm = ({ start, onSave }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div>
      <input placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Event Location" value={location} onChange={e => setLocation(e.target.value)} />
      <div className="mm-popup__box__footer__right-space">
        <button className="mm-popup__btn" onClick={() => onSave({ title, location, start, end: start })}>Save</button>
      </div>
    </div>
  );
};

const EditEventForm = ({ event, onSave, onDelete }) => {
  const [title, setTitle] = useState(event.title);
  const [location, setLocation] = useState(event.location);

  return (
    <div>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <input value={location} onChange={e => setLocation(e.target.value)} />
      <div className="mm-popup__box__footer__right-space">
        <button className="mm-popup__btn mm-popup__btn--info" onClick={() => onSave({ ...event, title, location })}>Save</button>
        <button className="mm-popup__btn mm-popup__btn--danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default App;
