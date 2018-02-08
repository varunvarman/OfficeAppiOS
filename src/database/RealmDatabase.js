import Realm from 'realm';

let repository = new Realm({
    schema: [{
        name: 'User',
        primaryKey: 'id',
        properties: {
            name: 'string',
            email: 'string',
            access_token: 'string',
            company: 'string',
            serverId: 'string',
            id: 'string',
            role: 'string',
            image_link: 'string',
            officaLocationID: 'string'
        }}]
});

let RealmDatabse = {
    findUser: function() {
        return repository.objects('User');
    },
    saveUser:async function(userModel) {
        try {
            return await saveUserAsync(userModel);
        }
        catch (error) {
            throw error;
        }
    }
};

export async function saveUserAsync(userModel){
    try{
        repository.write(() => {
            repository.create('User', userModel,true);
        });
        return userModel;
    }
    catch (error){
        throw error;
    }
}

module.exports = RealmDatabse;