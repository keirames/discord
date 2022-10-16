package entities

type User struct {
	ID    uint `gorm:"primaryKey"`
	Name  string
	Rooms []*Room `gorm:"many2many:user_rooms"`
}
