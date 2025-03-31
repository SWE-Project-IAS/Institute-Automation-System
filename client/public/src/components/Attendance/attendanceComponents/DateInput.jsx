import { useState } from 'react';
// import DatePicker from 'react-date-picker';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function DateInput() {
    const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker
        name='date'
        id='date'
        showIcon
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
    );
}

export default DateInput