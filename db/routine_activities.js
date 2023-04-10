const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [routine_activity] } = await client.query (
     `
    INSERT INTO routine_activities ("routineId", "activityId", count, duration)
    VALUES($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING*;
    `, [routineId, activityId, count, duration]
    );
        return routine_activity;
  } catch(error){
    console.log("Error", error);
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows:[routine_activity] } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE id=$1;
      `, [id]
    );
    return routine_activity;
  } catch (error) {
    console.log("Error", error)
    alert ("Error", error);
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routine_activities } = client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE "routineId" = $1;
      `, [id]
    );
    return routine_activities;
  } catch (error) {
    console.log("Error", error)
    alert("Error", error);
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
      .map((key, index) => `"${key}" = $${ index + 1 }`)
      .join(", ");
  try {
    if (setString.length > 0) {
      const { rows: [routine] } = await client.query(
        `
        UPDATE routine_activities
        SET ${setString}
        WHERE id=${id}
        RETURTNING *;
        `, Object.values(fields)
      );
      return routine;
    }   
  } catch (error) {
    console.log("Error", error)
    alert("Error", error);
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [routine] } = await client.query(
      `
      DELETE FROM routine_activities
      WHERE "routineId" = $1
      RETURNING*;
      `, [id]
    );
    return routine;
  } catch (error) {
    console.log("Error", error)
    alert("Error", error);
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: [routine_activity] } = await client.query(
      `
      SELECT*
      FROM routine_activities
      JOIN routines ON routine_activities."routineId" = routines.id
      WHERE routine_activities.id = $1 AND "creatorId" = $2;
      
      `, [routineActivityId, userId]
    );
      return routine_activity;
  } catch(error) {
    console.log("Error", error);
    alert("Error", error);
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
