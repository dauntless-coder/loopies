<<<<<<< HEAD
package com.loopies.chat.repositories;

import com.loopies.chat.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface RoomRepository extends MongoRepository<Room, String> {


    //get room using room id
    Room findByRoomId(String roomId);
=======
package com.loopies.chat.repositories;

import com.loopies.chat.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface RoomRepository extends MongoRepository<Room, String> {


    //get room using room id
    Room findByRoomId(String roomId);
>>>>>>> c62048a1c6c82bca42de23bd30298edb2feeabde
}