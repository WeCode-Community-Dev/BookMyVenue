// A HELD unit whose hold has expired is treated as AVAILABLE everywhere it's
// read or claimed — expiry is enforced here, not by a sweeper job flipping
// the stored status back.
function getEffectiveStatus(unit) {
   if (unit.status === "HELD" && unit.heldUntil && unit.heldUntil < new Date()) {
      return "AVAILABLE";
   }
   return unit.status;
}

module.exports = getEffectiveStatus;
