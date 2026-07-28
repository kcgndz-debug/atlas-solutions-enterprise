const AtlasTravel = {
  defaults: {
    origin: "Brooksville, FL",
    mileageRate: 2.5,
    halfDayLaborRate: 750,
    fullDayLaborRate: 1500,
    hotelRate: 1000
  },

  calculate(input = {}) {
    const oneWayMiles = Math.max(
      0,
      Number(input.oneWayMiles) || 0
    );

    const mileageRate = Math.max(
      0,
      Number(input.mileageRate) || this.defaults.mileageRate
    );

    const roundTrip = Boolean(input.roundTrip);

    const totalMiles = roundTrip
      ? oneWayMiles * 2
      : oneWayMiles;

    const mileageTotal =
      totalMiles * mileageRate;

    const fieldVerificationTotal =
      input.fieldVerificationEnabled
        ? Math.max(
            0,
            Number(input.fieldVerificationCharge) || 0
          )
        : 0;

    let travelLaborTotal = 0;

    switch (input.travelLaborType) {
      case "half-day":
        travelLaborTotal =
          this.defaults.halfDayLaborRate;
        break;

      case "full-day":
        travelLaborTotal =
          this.defaults.fullDayLaborRate;
        break;

      case "custom":
        travelLaborTotal = Math.max(
          0,
          Number(input.customTravelLabor) || 0
        );
        break;

      default:
        travelLaborTotal = 0;
    }

    const hotelNights =
      input.overnightStay
        ? Math.max(
            0,
            Number(input.hotelNights) || 0
          )
        : 0;

    const hotelRate = Math.max(
      0,
      Number(input.hotelRate) ||
        this.defaults.hotelRate
    );

    const hotelTotal =
      hotelNights * hotelRate;

    const perDiemDays = Math.max(
      0,
      Number(input.perDiemDays) || 0
    );

    const perDiemRate = Math.max(
      0,
      Number(input.perDiemRate) || 0
    );

    const perDiemTotal =
      perDiemDays * perDiemRate;

    const tolls = Math.max(
      0,
      Number(input.tolls) || 0
    );

    const parking = Math.max(
      0,
      Number(input.parking) || 0
    );

    const miscellaneous = Math.max(
      0,
      Number(input.miscellaneous) || 0
    );

    const otherTotal =
      tolls +
      parking +
      miscellaneous;

    const calculatedTotal =
      mileageTotal +
      fieldVerificationTotal +
      travelLaborTotal +
      hotelTotal +
      perDiemTotal +
      otherTotal;

    const manualOverrideTotal = Math.max(
      0,
      Number(input.manualOverrideTotal) || 0
    );

    const total =
      input.manualOverrideEnabled
        ? manualOverrideTotal
        : calculatedTotal;

    return {
      projectAddress:
        input.projectAddress || "",

      oneWayMiles,
      roundTrip,
      totalMiles,
      mileageRate,
      mileageTotal,

      fieldVerificationTotal,
      travelLaborTotal,

      hotelNights,
      hotelRate,
      hotelTotal,

      perDiemDays,
      perDiemRate,
      perDiemTotal,

      tolls,
      parking,
      miscellaneous,
      otherTotal,

      manualOverrideEnabled:
        Boolean(input.manualOverrideEnabled),

      manualOverrideTotal,
      calculatedTotal,
      total
    };
  },

  openGoogleMaps(address) {
    const cleanAddress =
      String(address || "").trim();

    if (!cleanAddress) {
      return false;
    }

    const origin =
      encodeURIComponent(this.defaults.origin);

    const destination =
      encodeURIComponent(cleanAddress);

    const url =
      "https://www.google.com/maps/dir/?api=1" +
      `&origin=${origin}` +
      `&destination=${destination}` +
      "&travelmode=driving";

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    return true;
  }
};

window.AtlasTravel = AtlasTravel;