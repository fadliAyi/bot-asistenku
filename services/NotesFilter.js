class NotesFilter {
    constructor(notes) {
        this.notes = notes;
    }

    thisMonth() {
        let now = new Date();
        return this.notes.filter(item => {
            let transformDate = new Date(item.date);
            return now.getMonth() == transformDate.getMonth();
        });
    }

    filterByDay() {
        let notes = this.thisMonth();
        let byDay = notes.reduce((groups, item) => {
            let date = new Date(item.date).toLocaleDateString();
            if(!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(item);
            return groups;
        }, {});

        let byDayData = Object.keys(byDay).map((date) => {
            return {
                date,
                data: byDay[date]
            };
        });

        return byDayData;
    }
}

module.exports = NotesFilter;