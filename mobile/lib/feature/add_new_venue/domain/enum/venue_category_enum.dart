enum VenueCategory {
  marriageHall,
  partyHall,
  conferenceRoom,
  auditorium,
  sportsGround,
  photographyStudio,
}

extension VenueCategoryX on VenueCategory {
  String get title {
    switch (this) {
      case VenueCategory.marriageHall:
        return 'Marriage Hall';
      case VenueCategory.partyHall:
        return 'Party Hall';
      case VenueCategory.conferenceRoom:
        return 'Conference Room';
      case VenueCategory.auditorium:
        return 'Auditorium';
      case VenueCategory.sportsGround:
        return 'Sports Ground';
      case VenueCategory.photographyStudio:
        return 'Photography Studio';
    }
  }

  String get apiValue {
    switch (this) {
      case VenueCategory.marriageHall:
        return 'marriage_hall';
      case VenueCategory.partyHall:
        return 'party_hall';
      case VenueCategory.conferenceRoom:
        return 'conference_room';
      case VenueCategory.auditorium:
        return 'auditorium';
      case VenueCategory.sportsGround:
        return 'sports_ground';
      case VenueCategory.photographyStudio:
        return 'photography_studio';
    }
  }

  static VenueCategory fromTitle(String title) {
    return VenueCategory.values.firstWhere((e) => e.title == title);
  }
}

class SlotTemplate {
  const SlotTemplate({
    required this.name,
    required this.startTime,
    required this.endTime,
  });

  final String name;
  final String startTime;
  final String endTime;
}

class VenueSlotConfig {
  static const Map<VenueCategory, List<SlotTemplate>> slots =
      <VenueCategory, List<SlotTemplate>>{
        VenueCategory.marriageHall: <SlotTemplate>[
          SlotTemplate(
            name: 'Morning Session',
            startTime: '09:00 AM',
            endTime: '03:00 PM',
          ),
          SlotTemplate(
            name: 'Evening Session',
            startTime: '05:00 PM',
            endTime: '11:00 PM',
          ),
          SlotTemplate(
            name: 'Full Day',
            startTime: '09:00 AM',
            endTime: '11:00 PM',
          ),
        ],

        VenueCategory.auditorium: <SlotTemplate>[
          SlotTemplate(
            name: 'Morning Session',
            startTime: '09:00 AM',
            endTime: '03:00 PM',
          ),
          SlotTemplate(
            name: 'Evening Session',
            startTime: '05:00 PM',
            endTime: '11:00 PM',
          ),
          SlotTemplate(
            name: 'Full Day',
            startTime: '09:00 AM',
            endTime: '11:00 PM',
          ),
        ],

        VenueCategory.partyHall: <SlotTemplate>[
          SlotTemplate(name: '2 Hours', startTime: '', endTime: ''),
          SlotTemplate(name: '4 Hours', startTime: '', endTime: ''),
          SlotTemplate(name: '6 Hours', startTime: '', endTime: ''),
          SlotTemplate(name: '8 Hours', startTime: '', endTime: ''),
        ],

        VenueCategory.conferenceRoom: <SlotTemplate>[
          SlotTemplate(name: '2 Hours', startTime: '', endTime: ''),
          SlotTemplate(name: '4 Hours', startTime: '', endTime: ''),
          SlotTemplate(name: '6 Hours', startTime: '', endTime: ''),
          SlotTemplate(name: '8 Hours', startTime: '', endTime: ''),
          SlotTemplate(
            name: 'Full Day',
            startTime: '09:00 AM',
            endTime: '09:00 PM',
          ),
        ],

        VenueCategory.sportsGround: <SlotTemplate>[
          SlotTemplate(name: '1 Hour', startTime: '', endTime: ''),
          SlotTemplate(name: '2 Hours', startTime: '', endTime: ''),
          SlotTemplate(name: '3 Hours', startTime: '', endTime: ''),
        ],

        VenueCategory.photographyStudio: <SlotTemplate>[
          SlotTemplate(name: '1 Hour', startTime: '', endTime: ''),
          SlotTemplate(name: '2 Hours', startTime: '', endTime: ''),
          SlotTemplate(name: '4 Hours', startTime: '', endTime: ''),
          SlotTemplate(name: '8 Hours', startTime: '', endTime: ''),
        ],
      };
}
