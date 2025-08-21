const config = {
  sites: [
    {
      title: "Home",
      center: [24.6507, 59.3927],
      zoom: 14.42,
      stops: [
        {
          id: 67,
          name: 'Mäepealse',
          location: [24.64463, 59.39436],
          transports: [
            { type: 'bus', route: '24', direction: 'Estonia' },
          ],
          timetable: {
            position: [24.64601, 59.39449],
            positioning: 'top-left',
            offset: [-20, 15],
          }
        },
        {
          id: 930,
          name: 'Mäepealse',
          location: [24.64428, 59.39467],
          transports: [
            { type: 'bus', route: '24', direction: 'Kadaka' },
            { type: 'bus', route: '20', direction: 'Estonia' },
            { type: 'bus', route: '20A', direction: 'Sadam' },
          ],
          timetable: {
            position: [24.64446, 59.39475],
            positioning: 'bottom-left',
            offset: [20, -15],
            height: 3
          }
        },
        {
          id: 931,
          name: 'Mäepealse',
          location: [24.64397, 59.39460],
          transports: [
            { type: 'bus', route: '20', direction: 'Laagri' },
            { type: 'bus', route: '20A', direction: 'Laagri' },
          ],
          timetable: {
            position: [24.64268, 59.39470],
            positioning: 'center-right',
            offset: [0, 15]
          }
        },
        {
          id: 68,
          name: 'Kivinuka',
          location: [24.65229, 59.39487],
          transports: [
            { type: 'bus', route: '24', direction: 'Estonia' },
          ],
          timetable: {
            position: [24.65241, 59.39477],
            positioning: 'top-center',
            offset: [0, 15]
          }
        },
      ]
    },

    {
      title: "Lasteaed",
      center: [24.66200, 59.40103],
      zoom: 15.1,
      stops: [
        {
          id: 917,
          name: 'Kaja',
          location: [24.66452 , 59.40336],
          transports: [
            { type: 'bus', route: '9', direction: 'Estonia' },
            { type: 'bus', route: '20', direction: 'Sadam' },
            { type: 'bus', route: '20A', direction: 'Sadam' },
            { type: 'bus', route: '24', direction: 'Estonia' }
          ],
          timetable: {
            position: [24.66452 , 59.40336],
            positioning: 'top-left',
            offset: [0, 25],
          }
        },
        {
          id: 927,
          name: 'Kadaka',
          location: [24.65627, 59.40335],
          transports: [
            { type: 'bus', route: '9', direction: 'Estonia' },
            { type: 'bus', route: '11', direction: 'Estonia' },
            { type: 'bus', route: '20', direction: 'Sadam' },
            { type: 'bus', route: '20A', direction: 'Sadam' }
          ],
          timetable: {
            position: [24.65627, 59.40335],
            positioning: 'top-left',
            offset: [-60, 10],
          }
        },
        {
          id: 905,
          name: 'E.Vilde tee',
          location: [24.66874, 59.40469],
          transports: [
            { type: 'bus', route: '28', direction: 'Veerenni' }
          ],
          timetable: {
            position: [24.66874, 59.40469],
            positioning: 'bottom-right',
            offset: [-40, 0],
          }
        },
      ]
    },

    {
      title: "Bolt",
      center: [24.74926, 59.43000],
      zoom: 14.5,
      stops: [
        {
          id: 1249,
          name: 'Vineeri',
          location: [24.74234, 59.42288],
          transports: [
            { type: 'bus', route: '20', direction: 'Pääsküla' },
            { type: 'bus', route: '20A', direction: 'Laagri' }
          ]
        },
        {
          id: 1322,
          name: 'Vabaduse väljak',
          location: [24.74426, 59.43321],
          transports: [
            { type: 'bus', route: '9', direction: 'Kadaka' }
          ]
        },
        {
          id: 1281,
          name: 'Vabaduse väljak',
          location: [24.74721, 59.43299],
          transports: [
            { type: 'bus', route: '11', direction: 'Kadaka' }
          ]
        },
        {
          id: 1282,
          name: 'Vabaduse väljak',
          location: [24.74642, 59.43304],
          transports: [
            { type: 'bus', route: '24', direction: 'Kadaka' }
          ]
        },

      ]
    },
  ],

  colors: {
    // https://coolors.co/palettes/maps
    '9': '#7f4747',
    '11': '#7f4747',
    '20': '#4895ef',
    '20A': '#4895ef',
    '24': '#81b29a',
    '28': '#abb281',
  }
}

export default config
