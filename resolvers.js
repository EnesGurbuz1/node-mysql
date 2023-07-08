const db = require('./db.js');

// Çözümleyiciler (resolvers) tanımı
const resolvers = {
    Query: {
      getUser: (_, { id }) => {
        if (typeof id !== 'number') {
          throw new Error('Geçerli bir kullanıcı kimliği sağlanmalıdır.');
        }
        return new Promise((resolve, reject) => {
          const query = `SELECT * FROM users WHERE id = ${id}`;
          db.query(query, (err, results) => {
            if (err) {
              reject(err);
            } else {
              if (results.length > 0) {
                const user = {
                  id: results[0].id,
                  name: results[0].name,
                  email: results[0].email
                };
                resolve(user);
              } else {
                resolve(null);
              }
            }
          });
        });
      },
      getUsers: () => {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM users';
          db.query(query, (err, results) => {
            if (err) {
              reject(err);
            } else {
              const users = results.map(result => ({
                id: result.id,
                name: result.name,
                email: result.email
              }));
              resolve(users);
            }
          });
        });
      }
    },
    Mutation: {
      addUser: (_, { id, name, email }) => {
        return new Promise((resolve, reject) => {
          const checkQuery = `SELECT id FROM users WHERE id = ${id}`;
          db.query(checkQuery, (err, results) => {
            if (err) {
              reject(err);
            } else {
              if (results.length > 0) {
                reject(new Error('Belirtilen ID\'ye sahip bir kullanıcı zaten var.'));
              } else {
                const insertQuery = `INSERT INTO users (id, name, email) VALUES (${id}, '${name}', '${email}')`;
                db.query(insertQuery, (err, results) => {
                  if (err) {
                    reject(err);
                  } else {
                    const newUser = {
                      id,
                      name,
                      email
                    };
                    resolve(newUser);
                  }
                });
              }
            }
          });
        });
      },
      deleteUser: (_, { id }) => {
        if (typeof id !== 'number') {
          throw new Error('Geçerli bir kullanıcı kimliği sağlanmalıdır.');
        }
        return new Promise((resolve, reject) => {
          const query = `DELETE FROM users WHERE id = ${id}`;
          db.query(query, (err, results) => {
            if (err) {
              reject(err);
            } else {
              if (results.affectedRows > 0) {
                resolve(id);
              } else {
                resolve(null);
              }
            }
          });
        });
      },
      updateUser: (_, { id, name, email }) => {
        return new Promise((resolve, reject) => {
          let updates = [];      
          if (name) {
            updates.push(`name = '${name}'`);
          }      
          if (email) {
            updates.push(`email = '${email}'`);
          }      
          if (updates.length === 0) {
            reject(new Error('Güncellenecek bir isim veya email sağlanmalıdır.'));
          } else {
            const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ${id}`;      
            db.query(query, (err, results) => {
              if (err) {
                reject(err);
              } else {
                if (results.affectedRows > 0) {
                  const updatedUser = {
                    id,
                    name,
                    email
                  };
                  resolve(updatedUser);
                } else {
                  reject(new Error('Belirtilen ID\'ye sahip bir kullanıcı bulunamadı.'));
                }
              }
            });
          }
        });
      }    
    }
  };

module.exports = resolvers;
